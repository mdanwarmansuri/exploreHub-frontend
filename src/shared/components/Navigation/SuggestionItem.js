import React,{useState,useContext} from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import './RightBar.scss';

const SuggestionItem = (props) =>{

    const [connectClicked,setConnectClicked] = useState(false);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const auth = useContext(AuthContext);

    const connectHandler = async (event,id) =>{
        event.stopPropagation();
        event.preventDefault();
        try {
          if (connectClicked) {
            const responseData = await sendRequest(
              "http://localhost:5000/api/users/cancelRequest",
              "POST",
              JSON.stringify({
                senderId: auth.userId,
                receiverId: id,
              }),
              {
                "Content-Type": "application/json",
              }
            );
           setConnectClicked(false);
          }
          
          else{
            const responseData = await sendRequest(
              "http://localhost:5000/api/users/connRequest",
              "POST",
              JSON.stringify({
                senderId: auth.userId,
                receiverId: id,
              }),
              {
                "Content-Type": "application/json",
              }
            );
            setConnectClicked(true);
          }
        } catch (err) {}
      }
    
    return (
        <Link to={`/user/${props.user.id}`} className="suggestion-item" key={props.user.id}>
            <img src={`http://localhost:5000/${props.user.image}`} alt="" />
            <div className="user-info">
                <span>{props.user.name}</span>
                <span className="mutual">{props.user.mutual} mutual friends</span>
            </div>
            {!connectClicked && <button className="connect" onClick={(event) => connectHandler(event,props.user.id)}>Connect</button>}
            {connectClicked && <button className="cancel"onClick={(event) => connectHandler(event,props.user.id)}>Cancel</button>}
          </Link>
    )
}

export default SuggestionItem;