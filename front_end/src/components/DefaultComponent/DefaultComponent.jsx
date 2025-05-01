import Header from "../Layouts/Header"

function DefaultComponent({children}){
    return(
        <div>
            <Header/>
            {children}
        </div>
    )
    }
    
    export default DefaultComponent