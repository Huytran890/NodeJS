import { CustomComponentPros, mergeClassName } from "@/utils/interface"

const Container = (props: CustomComponentPros) => {
    return (
        <div className={mergeClassName('mx-auto w-5/6 py-3', props?.className)}>{props.children}</div>
    )
}

export default Container