import "../App.css";
import "../general.css";

function Mensajes({mensaje, showMsj, showErrorMsj}) {
  return (
    <div className="container__mensajes">
        {(showErrorMsj) &&
            <div className="mensaje__error">
                <p>{mensaje}</p>
            </div>
        }
        {(showMsj) &&
            <div className="mensaje__ok">
                <p>{mensaje}</p>
            </div>
        }
    </div>
  );
}

export default Mensajes;