import { children } from "react";

const FormBtn = ({ onClick, children, ...props }) => {
    return (
        <>
            <button
                onClick={onClick}
                className='font-semibold 
                    text-white text-[18px] 
                    bg-[#1DB954] hover:bg-[#1ed760] 
                    h-10 w-full 
                    rounded-full 
                    transition duration-300 mt-4
                    cursor-pointer
                '
            >
                {children}
            </button>

        </>
    );
}

export default FormBtn;

