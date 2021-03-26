import { registryForRueClassName } from '@/registries';

export const RueClassName = (klassName: string) => (target) => {
  const registerdRueClasses = registryForRueClassName.read<string[]>('array');

  if (registerdRueClasses.includes(klassName)) {
    throw `'${klassName}' is a klassName that is already in use. Please use another name`;
  } else {
    registryForRueClassName.create([klassName]);
    const klassNameForStatic = target.name;
    const klassNameForPrototype = target.constructor.name;
    target.__defineGetter__('name', function () {
      return klassName || klassNameForStatic;
    });
    target.prototype.constructor.__defineGetter__('name', function () {
      return klassName || klassNameForPrototype;
    });
    return target;
  }
};
