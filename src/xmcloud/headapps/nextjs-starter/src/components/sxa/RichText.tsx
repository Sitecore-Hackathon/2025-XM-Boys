import React from 'react';
import { Field, RichText as JssRichText } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { withEditableToolsWrapper } from 'lib/jarvis/with-editable-tools-wrapper';
interface Fields {
  Text: Field<string>;
}

export type RichTextProps = ComponentProps & {
  fields: Fields;
};

export const Default = withEditableToolsWrapper()<ComponentProps>(
  (props: RichTextProps): JSX.Element => {
    const text = props.fields ? (
      <JssRichText field={props.fields.Text} />
    ) : (
      <span className="is-empty-hint">Rich text</span>
    );
    const id = props.params.RenderingIdentifier;

    return (
      <div
        className={`component rich-text ${props?.params?.styles.trimEnd()}`}
        id={id ? id : undefined}
      >
        <div className="component-content">{text}</div>
      </div>
    );
  }
);
