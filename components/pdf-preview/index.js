import React, { useState, useContext } from "react";
import Viewer, {
  Button,
  defaultLayout,
  Worker,
  SpecialZoomLevel,
} from "@phuocng/react-pdf-viewer";

import ReactDOM from "react-dom";

import { ThemeContext } from "../../context";
import CloseIcon from "@material-ui/icons/Close";
import { useMediaQuery } from "react-responsive";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css";

const PdfPreview = ({ pdf, onClose, isDarkOnSm = false, containerClasses, isPage }) => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 650px)" });
  const [isDark] = useContext(ThemeContext).theme;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderToolbar = (toolbarSlot) => {
    return (
      <div
        className={isDark || isDarkOnSm ? "pdf-toolbar-dark" : ""}
        style={{ alignItems: "center", display: "flex", width: "100%" }}
      >
        <div style={{ alignItems: "center", display: "flex" }}>
          <div
            style={{ padding: "2px", cursor: "pointer" }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MoreVertIcon />
          </div>

          <div style={{ padding: "2px" }}>{toolbarSlot.previousPageButton}</div>
          <div style={{ padding: "2px" }}>
            {toolbarSlot.currentPageInput} / {toolbarSlot.numPages}
          </div>
          <div style={{ padding: "2px" }}>{toolbarSlot.nextPageButton}</div>
        </div>

        {!isSmallScreen && (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexGrow: 1,
              flexShrink: 1,
              justifyContent: "center",
            }}
          >
            <div style={{ padding: "2px" }}>{toolbarSlot.zoomOutButton}</div>
            <div style={{ padding: "2px" }}>{toolbarSlot.zoomPopover}</div>
            <div style={{ padding: "2px" }}>{toolbarSlot.zoomInButton}</div>
          </div>
        )}
        {!isPage && <div
          style={{
            alignItems: "center",
            display: "flex",
            marginLeft: "auto",
          }}
        >
          {!isSmallScreen && (
            <div style={{padding: "0 0px"}}>
              {toolbarSlot.fullScreenButton}
            </div>
          )}
          <div style={{marginLeft: "auto", padding: "0 2px"}}>
            <Button onClick={onClose}>
              <CloseIcon/>
            </Button>
          </div>
        </div>}
      </div>
    );
  };

  const modalBody = () => (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{
        backgroundColor: isDark || isDarkOnSm ? "#202020" : "#fff",
        msUserSelect: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        left: 0,
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        margin: "auto",
        height: isSmallScreen ? "100%" : "90%",
        width: isSmallScreen ? "100%" : "90%",
        zIndex: 9999,
        maxWidth: "1080px",
        ...containerClasses
      }}
      className={(isDark || isDarkOnSm) && "pdf-dark"}
    >
      <Viewer
        defaultScale={SpecialZoomLevel.PageWidth}
        fileUrl={`${pdf}`}
        layout={(_, container, main, toolbar, sidebar) =>
          defaultLayout(
            sidebarOpen,
            container,
            main,
            toolbar(renderToolbar),
            sidebar
          )
        }
        renderPage={renderPage}
      />
    </div>
  );

  const renderPage = (props) => {
    return (
      <>
        {props.canvasLayer.children}
        {props.annotationLayer.children}
      </>
    );
  };
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
      {ReactDOM.createPortal(modalBody(), document.body)}
    </Worker>
  );
};

export default PdfPreview;
