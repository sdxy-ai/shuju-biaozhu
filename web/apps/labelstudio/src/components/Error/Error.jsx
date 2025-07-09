import { Fragment, useCallback, useMemo, useState } from "react";
import sanitizeHtml from "sanitize-html";
import { IconSlack } from "@humansignal/icons";
import { Block, Elem } from "../../utils/bem";
import { absoluteURL, copyText } from "../../utils/helpers";
import { Button } from "../Button/Button";
import { Space } from "../Space/Space";
import "./Error.scss";

const SLACK_INVITE_URL = "https://slack.labelstud.io/?source=product-error-msg";

export const ErrorWrapper = ({
  title,
  message,
  errorId,
  stacktrace,
  validation,
  version,
  onGoBack,
  onReload,
  possum = false,
}) => {
  const preparedStackTrace = useMemo(() => {
    return (stacktrace ?? "").trim();
  }, [stacktrace]);

  const [copied, setCopied] = useState(false);

  const copyStacktrace = useCallback(() => {
    setCopied(true);
    copyText(preparedStackTrace);
    setTimeout(() => setCopied(false), 1200);
  }, [preparedStackTrace]);

  return (
    <Block name="error-message">
      {possum !== false && (
        <Elem
          tag="img"
          name="heidi"
          src={absoluteURL("/static/images/opossum_broken.svg")}
          height="111"
          alt="Heidi's down"
        />
      )}

      {title && <Elem name="title">{title}</Elem>}

      {message && (
        <Elem
          name="detail"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(String(message)),
          }}
        />
      )}

      {preparedStackTrace && (
        <Elem
          name="stracktrace"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(preparedStackTrace.replace(/(\n)/g, "<br>")),
          }}
        />
      )}

      {validation?.length > 0 && (
        <Elem tag="ul" name="validation">
          {validation.map(([field, errors]) => (
            <Fragment key={field}>
              {[].concat(errors).map((err, i) => (
                <Elem tag="li" key={i} name="message" dangerouslySetInnerHTML={{ __html: sanitizeHtml(err) }} />
              ))}
            </Fragment>
          ))}
        </Elem>
      )}

      {(version || errorId) && (
        <Elem name="version">
          <Space>
            {version && `Version: ${version}`}
            {errorId && `Error ID: ${errorId}`}
          </Space>
        </Elem>
      )}

      <Elem name="actions">
        <Space spread>
          <Elem tag={Button} name="action-slack" target="_blank" icon={<IconSlack />} href={SLACK_INVITE_URL}>
            在 Slack 上提问
          </Elem>

          <Space size="small">
            {preparedStackTrace && (
              <Button disabled={copied} onClick={copyStacktrace} style={{ width: 180 }}>
                {copied ? "已复制" : "复制堆栈跟踪信息"}
              </Button>
            )}
            {onGoBack && <Button onClick={onGoBack}>返回</Button>}
            {onReload && <Button onClick={onReload}>重新加载</Button>}
          </Space>
        </Space>
      </Elem>
    </Block>
  );
};
