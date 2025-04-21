import { DialScreenProps } from "../types/screens";
import DialScreenInternal from "./screenlets/DialScreenInternal";

function DialScreen({
    navigation,
    route
}: DialScreenProps) {
    return (
        <DialScreenInternal/>
    )
}

export default DialScreen