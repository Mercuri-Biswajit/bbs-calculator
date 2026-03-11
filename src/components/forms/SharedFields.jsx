import React from "react";
import { Field } from "../ui.jsx";

export const MF = ({ label, value, onChange }) => (
  <Field
    label={label}
    value={value}
    onChange={onChange}
    unit="m"
    step="0.01"
    min="0"
  />
);

export const MMF = ({ label, value, onChange }) => (
  <Field
    label={label}
    value={value}
    onChange={onChange}
    unit="mm"
    step="10"
    min="50"
  />
);

export const NF = ({ label, value, onChange }) => (
  <Field
    label={label}
    value={value}
    onChange={onChange}
    unit="nos"
    step="1"
    min="1"
  />
);
