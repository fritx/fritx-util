type Next = () => Promise<void>

type Controller<T = any> = (ctx: Context, next?: Next) => Promise<T>
