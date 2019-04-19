type CallbackError = Error | null | void
type Callback<T = any[]> = (err?: CallbackError, ...args: T) => void
type Thunk<T = any> = (callback: Callback<T>) => void

// type Resolve = (value?: {} | PromiseLike<{}>) => void
type Resolve = (value?: any | PromiseLike<any>) => void

type ResolveValue<T> = T | Promise<T>
// type SyncOrAsync<T> = (() => T) | (() => Promise<T>)
type SyncOrAsync<TA extends any[], TR> = (...args: TA) => ResolveValue<TR>
