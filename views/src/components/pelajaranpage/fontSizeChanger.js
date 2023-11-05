import React from "react";
import { Tooltip } from "antd";
export function FontSizeChanger({fontSize, handleFontSizeChange}){
    return(
       <div><p>ukuran teks</p>
         <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
              <Tooltip title='h4' color={'blue'}>
              <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="btnradio1"
                value={4}
                checked={fontSize === 4}
                onChange={handleFontSizeChange}
              />
              <label className="btn rounded-start-pill btn-outline-primary align-items-center d-flex badge" htmlFor="btnradio1">FS-4</label>
              </Tooltip>
              <Tooltip title='h5' color={'blue'}>
              <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="btnradio2"
                value={5}
                checked={fontSize === 5}
                onChange={handleFontSizeChange}
              />
              <label className="btn btn-outline-primary rounded-0 align-items-center d-flex badge" htmlFor="btnradio2">FS-5</label>
              </Tooltip>
              <Tooltip title='h6' color={'blue'}>
              <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="btnradio3"
                value={6}
                checked={fontSize === 6}
                onChange={handleFontSizeChange}
              />
              <label className="btn rounded-end-pill btn-outline-primary align-items-center d-flex badge" htmlFor="btnradio3">FS-6</label>
              </Tooltip>
      </div>
    </div>
    )
}