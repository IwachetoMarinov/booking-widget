"use client";
import React, { useEffect } from "react";

const WIDGET_ORIGIN = "https://elevatione-booking-widget.netlify.app";

const Widget = () => {
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // Security: only accept messages from your widget domain
      if (event.origin !== WIDGET_ORIGIN) return;

      const data = event.data;
      if (!data || typeof data !== "object") return;

      // Redirect request
      console.log("Received message:", data, event);

      if (data.type === "WIDGET_REDIRECT" && typeof data.url === "string") {
        window.location.assign(data.url);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  //   Example script for WP and Rendered HTML pages

  //   <script>
  //   (function () {
  //     var WIDGET_ORIGIN = "https://elevatione-booking-widget.netlify.app";

  //     window.addEventListener("message", function (event) {
  //       if (event.origin !== WIDGET_ORIGIN) return;

  //       var data = event.data;
  //       if (!data || typeof data !== "object") return;

  //       if (data.type === "WIDGET_REDIRECT" && typeof data.url === "string") {
  //         window.location.assign(data.url);
  //       }
  //     });
  //   })();
  // </script>

  return (
    <section>
      <div>
        <h1>Embeded IFRAME</h1>

        {/* <iframe
          width="475"
          height="660"
          src={`${WIDGET_ORIGIN}`}
          frameBorder="0"
          style={{ display: "block" }}
        /> */}
      </div>
    </section>
  );
};

export default Widget;
