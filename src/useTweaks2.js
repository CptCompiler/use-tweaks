import { useLayoutEffect, useRef, useMemo } from 'react'
import Tweakpane from "tweakpane"
import zustandCreate from "zustand";
import pick from "lodash.pick";
import debounce from "lodash.debounce"

const useStore = zustandCreate((set) => ({
    setValue: (key, value) => set(() => ({ [key]: value }))
}));

function returnInitialData(constructionStuff) {

    return Object.entries(constructionStuff).reduce((acc, [key, inputDefintion]) => {
        let inputVal = null
        
        if (typeof inputDefintion === "object") {
            inputVal = inputDefintion.value
        } else {
            inputVal = inputDefintion
        }

        return { ...acc, [key]: inputVal }
    }, {})

}

export default function useTweaks2(id, constructionStuff) {

    const OBJECT = useRef({})
    const pane = useRef()

    useLayoutEffect(() => {

        if (typeof pane.current === "undefined") {

            pane.current = new Tweakpane({
                title: id,
                container: document.querySelector(`.test .t${id}`)
            })

        }

    }, [])
    
    const setValue = useStore(state => state.setValue)
    
    const keys = useRef([])
    const constructed = useRef(false)
    
    useLayoutEffect(() => {

        if (!constructed.current) {

            Object.entries(constructionStuff).map(([key, inputDefintion]) => {

                let inputVal = null
                let settings = {}
                
                
                if (typeof inputDefintion === "object") {
                    
                    const { value, ...sett } = inputDefintion
                    inputVal = value
                    settings = sett
                } else {
                    inputVal = inputDefintion
                }

                OBJECT.current[key] = inputVal
   
                // onchange, set value in state
                pane.current.addInput(OBJECT.current, key, settings)
                    .on('change', value => {
                        setValue(key, value)
                    })
                
    
                keys.current.push(key)
                // set init value
                setValue(key, inputVal) 
            })
    
            constructed.current = true

        }

    }, [constructionStuff])

    const valuesFromState = useStore(state => pick(state, keys.current))

    return constructed.current ?  valuesFromState : returnInitialData(constructionStuff)
    
}
