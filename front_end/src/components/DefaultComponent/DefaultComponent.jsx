import Header from "../Layouts/Header"

function DefaultComponent({Children}){
    return(
        <div>
            <Header/>
            {Children}
        </div>
    )
    }
    
    export default DefaultComponent