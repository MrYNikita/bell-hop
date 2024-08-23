/** Type describing events in bellhop. */
export type TBellEven = {
  act: (self: BellPoint) => void;
  cond?: (self: BellPoint) => boolean;
  name?: string;
  delt?: boolean;
  once?: boolean;
};
