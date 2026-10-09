// Sets the attribute to `value`, or removes it when `value` is null
export const setAttributeOrRemove = (element, name, value) => {
  if (value === null) element.removeAttribute(name);
  else element.setAttribute(name, value);
};
