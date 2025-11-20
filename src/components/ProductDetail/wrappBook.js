import { Dialog, DialogContent } from '@mui/material';
import React, { useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { IoMdClose } from 'react-icons/io';

import './style.css';

const WrapperBook = ({ open, handleClose, data }) => {
    const chapters = data?.description || [];
  
    const parsedData = JSON.parse(chapters);
 
    return (
        <div open={open} onClose={handleClose}>
            <Dialog open={open} maxWidth="lg">
                <div className="WrapperBook_Name">
                    <p>{data.name} </p>
                    <div className="close-btn">
                        <button onClick={handleClose}>
                            <IoMdClose />
                        </button>
                    </div>
                </div>
                <DialogContent sx={{ background: '#CDC1FF', overflow: 'hidden', position: 'relative' }}>
                    <HTMLFlipBook width={800} height={500} showCover={true} mobileScrollSupport={true}>
                        <div>
                            <div className="poster">
                                <div className="img">
                                    <img src={data.image} alt={data.name} />
                                </div>
                                <div className="cover">
                                    <p>{parsedData.title}</p>
                                    <p>{parsedData?.cover_image}</p>
                                </div>
                            </div>
                        </div>
                        {parsedData?.chapters.map((chapter, index) => (
                            <div key={index} className="page">
                                <div className="chapter_title">
                                    <h1>CHƯƠNG {chapter.chapter_number || chapter.chapter}: &nbsp;</h1>
                                    <h1>{chapter.title}</h1>
                                </div>
                                <p className="chapter_content">{chapter.content}</p>
                                {/* <button onClick={() => handleSpeech(chapter.content)} className="play-btn">
                                    {isReading ? <FaPause /> : <FaPlay />}
                                </button> */}
                            </div>
                        ))}
                    </HTMLFlipBook>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default WrapperBook;
