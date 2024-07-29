import "../App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

function ShowPassword({botonShowPassword, verPassword, hidePassword}) {
  return (
    <div>
        {(botonShowPassword) && 
            <button className="eyeButton" onClick={verPassword}>
                <FontAwesomeIcon icon={faEye} />
            </button>
        }
        {(!botonShowPassword) &&
            <button className="eyeButton" onClick={hidePassword}>
                <FontAwesomeIcon icon={faEyeSlash} />
            </button>
          }
    </div>
  );
}

export default ShowPassword;