import React, { useEffect, useRef } from "react";
import { Dialog, Modal,Button } from 'react-aria-components';


function Modal({ children, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown" || event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <Modal isDismissable>
      <Dialog>
        {({ close }) => (
          <div className="z-50 w-full h-full bg-black bg-opacity-50 fixed top-0 left-0 flex justify-center items-center">
            <div className="w-auto h-auto overflow-y-auto overflow-x-hidden relative bg-base-300 rounded-md p-5 pt-8 shadow-lg min-h-[750px] min-w-[880px]">
              <Button onPress={close} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-3xl">
                X
              </Button>
              {children}
            </div>
          </div>
        )}
      </Dialog>
    </Modal>
  );
}

export default Modal;
