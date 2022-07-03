
function Settings(props) {

    return <div className="Container mw Settings__container">     
        <button className="Settings__button" onClick={props.onChangeNameClicked}>Change Name</button>
        <button className="Settings__button" onClick={props.onChangePasswordClicked}>Change Password</button>
        <button className="Settings__button" onClick={props.onChangeEmailClicked}>Change email</button>
        <button className="Settings__button" onClick={props.onChangeFotoClicked}>Change foto</button>
        <p></p>
        <button className="Settings__button" onClick={props.onDeleteActivityClicked}>Delete activity</button>
        <p></p>
        <button className="Settings__button" onClick={props.onLogoutClicked}>Logout</button>
        <button className="Settings__button Settings__button--delete" onClick={props.onDeleteUserClicked}>Delete User</button>
    </div>
}

export default Settings