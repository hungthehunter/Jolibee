import { Spinner } from "react-bootstrap";

const LoadingComponent = ({children,isPending,delay=2000}) =>{

    return (
        <Spinner animation="border" role="status" variant="primary" delay={delay} style={{display: isPending ? "block" : "none"}}>
            {children}
        </Spinner>
    )
}

export default LoadingComponent;