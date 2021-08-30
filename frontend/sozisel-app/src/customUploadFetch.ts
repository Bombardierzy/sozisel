const parseHeaders = (rawHeaders: string) => {
  const headers = new Headers();
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
  preProcessedHeaders.split(/\r?\n/).forEach((line: any) => {
    const parts = line.split(":");
    const key = parts.shift().trim();
    if (key) {
      const value = parts.join(":").trim();
      headers.append(key, value);
    }
  });
  return headers;
};

/**
 * This is a custom fetch function for uploading files.
 * It allows to track the upload progress.
 * onUploadProgress can be passed to apollo's mutation context to track the upload percentage that is in range 1-100
 */
export const customUploadFetch = (
  url: string,
  options: any
): Promise<Response> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const responseInit: ResponseInit = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || ""),
      };

      const body = "response" in xhr ? xhr.response : xhr.responseText;
      resolve(new Response(body, responseInit));
    };
    xhr.onerror = () => {
      reject(new TypeError("Network request failed"));
    };
    xhr.ontimeout = () => {
      reject(new TypeError("Network request failed"));
    };
    xhr.onabort = () => {
      reject(new TypeError("Network request failed"));
    };
    xhr.open(options.method, url, true);

    Object.keys(options.headers).forEach((key) => {
      xhr.setRequestHeader(key, options.headers[key]);
    });

    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        options.onUploadProgress((100 * event.loaded) / event.total);
      };
    }

    if (options.onAbortPossible) {
      options?.onAbortPossible(() => {
        xhr.abort();
      });
    }

    xhr.send(options.body);
  });

export const customFetch = (uri: any, options: any) => {
  if (options.useUpload) {
    return customUploadFetch(uri, options);
  }
  return fetch(uri, options);
};
