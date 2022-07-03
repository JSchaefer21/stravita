import '../styles/Feedback.sass'

function Feedback({ type, message, callback }) { 

    setTimeout(callback, 3500)  // 3500
    
    return <div className={`Feedback Feedback--${type}`}>
        { type==='error' && <span className="Icon material-symbols-outlined">warning</span>}
        { type==='success' && <span className="Icon material-symbols-outlined">done</span>}
        <p className="Feedback__font">{message}</p>
    </div>
}

export default Feedback