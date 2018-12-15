import QuadTreeNode from "./QuadTreeNode";
import Rect from "../basic-geometry/Rect";
import Circle from "../basic-geometry/Circle";

class QuadTree {
  minimalSize: number;
  defaultValue: boolean;
  root: QuadTreeNode;

  constructor(
    width: number,
    height: number,
    defaultValue: boolean = true,
    minimalSize: number = 1
  ) {
    if (Math.log2(width) % 1 !== 0 || Math.log2(height) % 1 !== 0) {
      throw new Error("Width and height must be powers of 2");
    }
    this.minimalSize = minimalSize;
    this.defaultValue = defaultValue;
    const rootRect = [0, 0, width - 1, height - 1] as Rect;
    this.root = new QuadTreeNode(this, null, rootRect, defaultValue);
  }

  getWholeNodes() {
    return this.root.getWholeNodes();
  }

  drawRect(rect: Rect, value: boolean) {
    this.root.drawRect(rect, value);
  }
  drawCircle(circle: Circle, value: boolean) {
    this.root.drawCircle(circle, value);
  }
}

export { QuadTreeNode };

export default QuadTree;
