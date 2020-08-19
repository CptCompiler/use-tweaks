import Tweakpane from "tweakpane";
import create from "zustand";
import { useEffect, useLayoutEffect, useCallback, createRef } from "react";
import pick from "lodash.pick";
import memoize from "fast-memoize";
import shallow from "zustand/shallow";
import debounce from "lodash.debounce"

// Array pick, re-renders the component when either state.nuts or state.honey change

// this is the object that will be mutated by Tweakpane
const OBJECT = {};

const pane = new Tweakpane();

const useStore = create((set) => ({
  setValue: (key, value) => set(() => ({ [key]: value }))
}));

// this could be used to mount the child three only when the GUI is ready
export function GUIRoot({ children }) {
  return children;
}

export function useGUI(...keys) {
  const stuff = useStore((state) => Object.values(pick(state, keys)), shallow)
  
  return stuff;
}

const x = createRef()
x.current = {}

const debSetValue = debounce((values) => useStore.setState({ ...values }))

export function Input({
  name,
  options,
  value = 0,
  transform = (n) => n,
  ...settings
}) {
  
  const setValue = useStore((state) => state.setValue);

  // set initial values in the OBJECT and state
  useLayoutEffect(() => {
    if (typeof OBJECT[name] === "undefined") {
      
      // options are saved by option name instead of value in tweakpane
      if (typeof options !== "undefined") {

        const defValue = options[value] || options[Object.keys(options)[0]];

        OBJECT[name] = defValue;

      } else {

        OBJECT[name] = value;
        
      }

      // set initial values from object
      debSetValue(OBJECT)

      pane
        .addInput(OBJECT, name, { options, value, ...settings })
        .on("change", (value) => {

          const transformedValue = transform(value);

          // set the value in the zustand store when it changes
          debSetValue({ [name]: transformedValue })
          return transformedValue;

        });
    }
  }, [name, value, settings, options, setValue]);

  return null;
}
