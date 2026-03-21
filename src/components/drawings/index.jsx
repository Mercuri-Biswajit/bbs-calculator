import React from "react";
export * from "./DrawingShared";
export { DrawingFooting } from "./DrawingFooting";
export { DrawingColumn } from "./DrawingColumn";
export { DrawingBeam } from "./DrawingBeam";
export { DrawingSlab } from "./DrawingSlab";
export { DrawingStaircase } from "./DrawingStaircase";
export { DrawingLintel } from "./DrawingLintel";
export { DrawingRaft } from "./DrawingRaft";
export { DrawingPileCap } from "./DrawingPileCap";

import { DrawingFooting } from "./DrawingFooting";
import { DrawingColumn } from "./DrawingColumn";
import { DrawingBeam } from "./DrawingBeam";
import { DrawingSlab } from "./DrawingSlab";
import { DrawingStaircase } from "./DrawingStaircase";
import { DrawingLintel } from "./DrawingLintel";
import { DrawingRaft } from "./DrawingRaft";
import { DrawingPileCap } from "./DrawingPileCap";

export function getDrawing(type, item) {
  if (type === "footing") return <DrawingFooting {...item} />;
  if (type === "column") return <DrawingColumn {...item} />;
  if (type === "plinthBeam") return <DrawingBeam {...item} coverType="plinthBeam" />;
  if (type === "wallBeam") return <DrawingBeam {...item} coverType="wallBeam" />;
  if (type === "slab") return <DrawingSlab {...item} />;
  if (type === "staircase") return <DrawingStaircase {...item} />;
  if (type === "lintel") return <DrawingLintel {...item} />;
  if (type === "raft") return <DrawingRaft {...item} />;
  if (type === "pileCap") return <DrawingPileCap {...item} />;
  return null;
}
