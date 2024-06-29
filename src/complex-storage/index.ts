let lastStorageIndex = 0
const storage = new Map<string, any>()

export function getStorage(key: string): any {
    return storage.get(key)
}

export function setStorage(value: any): string {
  const storageKey = '#' + lastStorageIndex
  lastStorageIndex++
  storage.set(storageKey, value)
  return storageKey
}

// const storage = new WeakMap()

// export function setStorageItem(key: string, value: any) {
//   storage.set(key, value)
// }


// key = HTML Node

// But I though more about the key that I could share though multiple places, so key as HTML Node won't work
// Actually only string can work???


// If I use Map and WeakRef and FinalizationRegistry then it might be garbage collected.
// I need object to be free once there is no references to that object(?) or once the component who created this object doesn't exists(?)
// idk, because page gonna exists for loooong time

// Key needs ot be a string, so WeakMap is not an option at all


// So don't care if Object its's gonan be collected too quickly, then we can create one mroe right?

// In <parent> component we create that Object, and pass it to attributes, BUT
// how do we change it to pass a key-string, not real Object?? 
// - So it should be done in dynamic callback. call getKey(object), or maybe we should assign a Symbol to each object with propId??
// We cannot because we might want to pass a number, or null! Not jsut object!!!

// We WON"T use WeakMap evne here, because we might want to pass number, boolean or osmething else



// We HAVE TO use map
// storage = Map<string, any>
// actually the string key will change ONLY when there is an actal change of this.state
// So maybe we don't need to get key from object/value
// Unless it used with combination with other dynamics!!!!!

// 1. While passed from parent to child. In dynamics callback we create the id and put it in storage Map!
// 2. If value of the attribute start with #, we know we need to read from storage
// 3. 



// We don't care about string interpolation!!!!! Developer should check if used props are strings



// <component complex-prop="#3cr" />




// /*
// we need:
//  - component which receives prop
//  - source of information
//  - 
// */

// stepper.setAttribute('data2', 'xydnv')
// let counter = 0

// export default function setProp(child: HTMLElement, name: string, newValue: object) {
//   const oldKey = child.getAttribute('name')
//   const newKey = counter
//   storage.

//   counter ++
// }

// class BaseStorage extends HTMLElement {
//   connectedCallback() {
//     // but then we need to ALWAYS call super() inside connectedCallback
//   }
// }