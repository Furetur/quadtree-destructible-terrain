import * as Rect from "../basic-geometry/Rect";
import * as Circle from "../basic-geometry/Circle";
import { pipe } from "rambda";
import { arrConcat } from "../utils";
import QuadTree from ".";

const MIN_SIDE = 1;

export class QuadTreeNode {
  tree: QuadTree;
  parent: QuadTreeNode | null;
  rect: Rect.default;
  value: boolean | null;
  divided = false;
  northwest: QuadTreeNode | null = null;
  northeast: QuadTreeNode | null = null;
  southwest: QuadTreeNode | null = null;
  southeast: QuadTreeNode | null = null;

  constructor(
    tree: QuadTree,
    parent: QuadTreeNode | null,
    rect: Rect.default,
    value: boolean
  ) {
    this.tree = tree;
    this.parent = parent;
    this.rect = rect;
    this.value = value;
  }

  getChildren() {
    return [this.northwest, this.northeast, this.southeast, this.southwest];
  }

  getWholeNodes() {
    if (!this.divided) {
      return [this];
    }
    return arrConcat(...this.getChildren().map(node => node.getWholeNodes()));
  }

  isMinimalSize() {
    return Rect.minimalSize(this.rect) <= this.tree.minimalSize;
  }

  subdivide() {
    if (this.isMinimalSize()) return;

    const [x0, y0, x1, y1] = this.rect;
    const xMedian = Math.floor((x0 + x1) / 2);
    const yMedian = Math.floor((y0 + y1) / 2);
    const nw = [x0, y0, xMedian, yMedian] as Rect.default;
    const ne = [xMedian + 1, y0, x1, yMedian] as Rect.default;
    const sw = [x0, yMedian + 1, xMedian, y1] as Rect.default;
    const se = [xMedian + 1, yMedian + 1, x1, y1] as Rect.default;
    this.northwest = new QuadTreeNode(this.tree, this, nw, this.value);
    this.northeast = new QuadTreeNode(this.tree, this, ne, this.value);
    this.southwest = new QuadTreeNode(this.tree, this, sw, this.value);
    this.southeast = new QuadTreeNode(this.tree, this, se, this.value);
    this.divided = true;
    this.value = null;
  }

  /**
   * Unites the node (if divided) and sets its value
   * @param value Future value of this node
   */
  unite(value: boolean) {
    this.northwest = null;
    this.northeast = null;
    this.southeast = null;
    this.southwest = null;
    this.divided = false;
    this.value = value;
  }

  canBeUnited() {
    if (!this.divided) return false;
    if (this.getChildren().some(node => node.divided)) return false;
    const childrenValues = this.getChildren().map(node => node.value);
    if (childrenValues.includes(null)) return false;
    if (childrenValues.includes(false) && childrenValues.includes(true))
      return false;
    return true;
  }

  tryToUnite() {
    if (this.canBeUnited()) {
      this.unite(this.northwest.value);
    }
  }

  drawShape(
    shapeIntersects: (rect: Rect.default) => boolean,
    shapeContains: (rect: Rect.default) => boolean,
    value: boolean
  ) {
    // BASE CASES
    // ============
    if (this.isMinimalSize()) {
      // if the node is minimal size, then we can not subdivide it and we just approximately set its value
      // if this rect is untouched then we reassign its value
      if (this.value === this.tree.defaultValue)
        this.value = !shapeIntersects(this.rect);
      // otherwise we do not do anything because the rect is already erased
      return;
    }
    // if there is nothing to change
    if (this.value === value) {
      return;
    }
    // if this rect does not intersect with the shape
    if (!shapeIntersects(this.rect)) {
      return;
    }
    // if this node is inside the rect (or equal)
    if (shapeContains(this.rect)) {
      // unite it (if needed) and set its value
      this.unite(value);
      return;
    }

    // GENERAL CASE
    // ==============

    // divide the node if it is not divided already
    if (!this.divided) {
      this.subdivide();
    }
    // continue the recursion
    for (let node of this.getChildren()) {
      node.drawShape(shapeIntersects, shapeContains, value);
    }

    this.tryToUnite();
  }

  drawRect(rect: Rect.default, value) {
    return this.drawShape(
      Rect.intersectsRect(rect),
      Rect.containsRect(rect),
      value
    );
  }
  drawCircle(circle, value) {
    return this.drawShape(
      Circle.intersectsRect(circle),
      Circle.containsRect(circle),
      value
    );
  }
}

export default QuadTreeNode;
