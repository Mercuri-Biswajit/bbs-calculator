export { FootingForm } from "./FootingForm.jsx";
export { ColumnForm } from "./ColumnForm.jsx";
export { BeamForm } from "./BeamForm.jsx";
export { SlabForm } from "./SlabForm.jsx";
export { StaircaseForm } from "./StaircaseForm.jsx";
export { LintelForm } from "./LintelForm.jsx";
export { RaftForm } from "./RaftForm.jsx";
export { PileCapForm } from "./PileCapForm.jsx";

import { FootingForm } from "./FootingForm.jsx";
import { ColumnForm } from "./ColumnForm.jsx";
import { BeamForm } from "./BeamForm.jsx";
import { SlabForm } from "./SlabForm.jsx";
import { StaircaseForm } from "./StaircaseForm.jsx";
import { LintelForm } from "./LintelForm.jsx";
import { RaftForm } from "./RaftForm.jsx";
import { PileCapForm } from "./PileCapForm.jsx";

export function getForm(type) {
  return {
    footing: FootingForm,
    column: ColumnForm,
    plinthBeam: BeamForm,
    wallBeam: BeamForm,
    slab: SlabForm,
    staircase: StaircaseForm,
    lintel: LintelForm,
    raft: RaftForm,
    pileCap: PileCapForm,
  }[type];
}
