export type TargetType = typeof TargetType[keyof typeof TargetType];
export const TargetType = {
  FOLDER: 'FOLDER',
  FILE: 'FILE',
  LINK: 'LINK',
};
