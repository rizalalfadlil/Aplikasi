import { ImageUrl } from '../pelajaran';
import '../style.css';
export function AnswerOption(props) {
    const handleOptionChange = () => {
      if (props.onChange) {
        props.onChange(props.no); // Mengirimkan jawaban terpilih ke komponen induk
      }
    };
  
    return (
      <div className={`col-12 col-md-3`}>
      <div className='d-flex justify-content-center mb-2'>
      <ImageUrl src={props.src}/>
      </div>
        <input type="radio" className="btn-check" name="options" id={`option` + props.no} autoComplete="off" checked={props.no === props.jawaban} onChange={handleOptionChange}/>
            <label htmlFor={`option` + props.no} className="p-4 border rounded-3 btn text-light animated answer-button d-flex flex-column align-items-center justify-content-center w-100">
              <div className={` danger-html col-content fs-${props.fs}`} dangerouslySetInnerHTML={{ __html: props.isi }}/>
            </label>
      </div>
    );
  }