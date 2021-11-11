import { pipe } from 'ramda';

export enum AnnotationType {
  InputBoolean = 'boolean',
  InputMultiSelect = 'multi-select',
  InputNumber = 'number',
  LineSlot = 'line',
  Box2dSlot = 'box2d',
  PointSlot = 'point',
}

export type Point = {
  x: number;
  y: number;
};

export type Plane = {
  bottomLeft: Point;
  bottomRight: Point;
  topLeft: Point;
  topRight: Point;
};

export type InputBoolean = {
  type: AnnotationType.InputBoolean;
  name: string;
  value: boolean;
};

export type InputMultiSelect = {
  type: AnnotationType.InputMultiSelect;
  name: string;
  value: string[];
};

export type InputNumber = {
  type: AnnotationType.InputNumber;
  name: string;
  value: number;
};

export type LineSlot = {
  type: AnnotationType.LineSlot;
  id: string;
  label: string;
  vertices: Point[];
};

export type Box2dSlot = {
  type: AnnotationType.Box2dSlot;
  id: string;
  label: string;
  plane: Plane;
};

export type PointSlot = {
  type: AnnotationType.PointSlot;
  id: string;
  label: string;
  point: Point;
};

export type Annotation =
  | InputBoolean
  | InputMultiSelect
  | InputNumber
  | LineSlot
  | Box2dSlot
  | PointSlot;

//请完成如下几个函数
export const extractInputMultiSelect = pipe((data: Object) => {
  const multi_select = data['default'].filter(
    (item) => item.type == 'multi-select'
  );
  let res = [];

  for (var i = 0; i < multi_select.length; i++) {
    if (multi_select[i].value && multi_select[i].value.length > 0) {
      let temp = multi_select[i].value;
      res = res.concat(temp);
    }
  }
  return res;
});

export const extractLines = pipe((data: Object) => {
  const lines = data['default'].filter((item) => item.type == 'line');

  let res = [];
  let lineDict = {};
  let label = [];
  // 生成键名存入label队列
  for (var i = 0; i < lines.length; i++) {
    if (!label.includes(lines[i].label)) {
      label.push(lines[i].label);
    }
  }
  // console.log(label);
  //把线段值存入对应的键中
  for (var j = 0; j < label.length; j++) {
    let lineWithLabel = lines.filter((item) => item.label == label[j]);
    let verticesWithLabel = [];
    for (var k = 0; k < lineWithLabel.length; k++) {
      // vertrics不存在或vertrics为空
      if (lineWithLabel[k].vertices && lineWithLabel[k].vertices.length > 0)
        verticesWithLabel.push(lineWithLabel[k].vertices);
    }
    lineDict[label[j]] = verticesWithLabel;
  }
  // console.log(lineDict);

  //对每个键下面的线段排序
  for (var key in lineDict) {
    let lineArr = lineDict[key];
    if (lineArr.length > 0) {
      // 选择排序
      // 遍历数组，设置最小值的索引为 0，如果取出的值比当前最小值小，就替换最小值索引，遍历完成后，将第一个元素和最小值索引上的值交换。如上操作后，第一个元素就是数组中的最小值，下次遍历就可以从索引 1 开始重复上述操作
      for (var t = 0; t < lineArr.length; t++) {
        var minIdex = t;
        for (var j = t + 1; j < lineArr.length; j++) {
          minIdex =
            Math.sqrt(Math.pow(lineArr[j].x, 2) + Math.pow(lineArr[j].y, 2)) <
            Math.sqrt(
              Math.pow(lineArr[minIdex].x, 2) + Math.pow(lineArr[minIdex].y, 2)
            )
              ? j
              : minIdex;
        }
        [lineArr[t], lineArr[minIdex]] = [lineArr[minIdex], lineArr[t]];
      }
      // 大的在后面
      // console.log('=======', lineArr);
      res.push(lineArr);
    }
  }
  return res;
});

export const extractBox2ds = pipe((data: Object) => {
  const lines = data['default'].filter((item) => item.type == 'box2d');
  let res = [];
  let lineDict = {};
  let label = [];
  // 生成键名存入label队列
  for (var i = 0; i < lines.length; i++) {
    if (!label.includes(lines[i].label)) {
      label.push(lines[i].label);
    }
  }
  // console.log(label);
  //把线段值存入对应的键中
  for (var j = 0; j < label.length; j++) {
    let lineWithLabel = lines.filter((item) => item.label == label[j]);
    let verticesWithLabel = [];
    // console.log(lineWithLabel);
    for (var k = 0; k < lineWithLabel.length; k++) {
      // vertrics不存在或vertrics为空
      if (lineWithLabel[k].plane)
        verticesWithLabel.push(lineWithLabel[k].plane);
    }
    lineDict[label[j]] = verticesWithLabel;
  }
  // console.log('lineDict', lineDict);

  //对每个键下面的线段排序
  for (var key in lineDict) {
    let lineArr = lineDict[key];
    if (lineArr.length > 0) {
      // 选择排序
      // 遍历数组，设置最小值的索引为 0，如果取出的值比当前最小值小，就替换最小值索引，遍历完成后，将第一个元素和最小值索引上的值交换。如上操作后，第一个元素就是数组中的最小值，下次遍历就可以从索引 1 开始重复上述操作
      for (var t = 0; t < lineArr.length; t++) {
        var minIdex = t;
        for (var j = t + 1; j < lineArr.length; j++) {
          minIdex =
            Math.sqrt(
              Math.pow(lineArr[j].bottomLeft.x, 2) +
                Math.pow(lineArr[j].bottomLeft.y, 2)
            ) <
            Math.sqrt(
              Math.pow(lineArr[minIdex].bottomLeft.x, 2) +
                Math.pow(lineArr[minIdex].bottomLeft.y, 2)
            )
              ? j
              : minIdex;
        }
        [lineArr[t], lineArr[minIdex]] = [lineArr[minIdex], lineArr[t]];
      }
      // 大的在后面
      // console.log('=======', lineArr);
      res.push(lineArr);
    }
  }
  return res;
});

export const extractPoints = pipe((data: Object) => {
  const lines = data['default'].filter((item) => item.type == 'point');

  let res = [];
  let lineDict = {};
  let label = [];
  // 生成键名存入label队列
  for (var i = 0; i < lines.length; i++) {
    if (!label.includes(lines[i].label)) {
      label.push(lines[i].label);
    }
  }
  // console.log(label);
  //把线段值存入对应的键中
  for (var j = 0; j < label.length; j++) {
    let lineWithLabel = lines.filter((item) => item.label == label[j]);
    let verticesWithLabel = [];
    for (var k = 0; k < lineWithLabel.length; k++) {
      // point存在
      if (lineWithLabel[k].point)
        verticesWithLabel.push(lineWithLabel[k].point);
    }
    lineDict[label[j]] = verticesWithLabel;
  }
  // console.log(lineDict);

  //对每个键下面的线段排序
  for (var key in lineDict) {
    let lineArr = lineDict[key];
    if (lineArr.length > 0) {
      // 选择排序
      // 遍历数组，设置最小值的索引为 0，如果取出的值比当前最小值小，就替换最小值索引，遍历完成后，将第一个元素和最小值索引上的值交换。如上操作后，第一个元素就是数组中的最小值，下次遍历就可以从索引 1 开始重复上述操作
      for (var t = 0; t < lineArr.length; t++) {
        var minIdex = t;
        for (var j = t + 1; j < lineArr.length; j++) {
          minIdex =
            Math.sqrt(Math.pow(lineArr[j].x, 2) + Math.pow(lineArr[j].y, 2)) <
            Math.sqrt(
              Math.pow(lineArr[minIdex].x, 2) + Math.pow(lineArr[minIdex].y, 2)
            )
              ? j
              : minIdex;
        }
        [lineArr[t], lineArr[minIdex]] = [lineArr[minIdex], lineArr[t]];
      }
      // 大的在后面
      // console.log('=======', lineArr);
      res.push(lineArr);
    }
  }
  return res;
});
