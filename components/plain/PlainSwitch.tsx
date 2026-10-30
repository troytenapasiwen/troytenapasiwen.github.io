"use client";

import { useContext } from "react";
import { DossierControls, ViewSwitch } from "@/components/dossier/controls";

/** The way back to the folder, in the plain edition's masthead. Hidden when motion is reduced or the window is too short. */
export default function PlainSwitch() {
  const { togglePlain, plain, canSwitch } = useContext(DossierControls);
  if (!canSwitch) return null;
  return <ViewSwitch plain={plain} onClick={togglePlain} className="pe-switch" />;
}
