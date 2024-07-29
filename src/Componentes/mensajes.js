import "../App.css";

function Mensajes({mensaje, showMsj, showErrorMsj, showErrorMsjPost}) {
  return (
    <div>
        {(showErrorMsj) &&
            <div>
                <p>{mensaje}</p>
            </div>
        }
        {(showMsj) &&
            <div>
                <p>{mensaje}</p>
            </div>
        }
        {(showErrorMsjPost) &&
            <div>
                <p>{mensaje}</p>
            </div>
        }
    </div>
  );
}

export default Mensajes;