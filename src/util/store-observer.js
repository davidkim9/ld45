export function storeObserver(store, selector, changeHandler) {
    // FIXME Introduce a better solution handling an empty value in the model
    let currentState = null;
    let unsubscribe = store.subscribe(storeDidChange);

    function storeDidChange() {
        let state = selector(store.getState());
        if (currentState !== state) {
            currentState = state;
            changeHandler(currentState, unsubscribe);
        }
    }

    // Initial state
    storeDidChange();

    return unsubscribe;
}
