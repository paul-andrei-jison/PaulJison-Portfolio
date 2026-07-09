import type { TextPart } from '@/types';

interface Props {
  parts: TextPart[];
  className?: string;
  as?: 'p' | 'span' | 'h2' | 'h3';
}

export default function RichText({ parts, className, as: Tag = 'p' }: Props) {
  return (
    <Tag className={className}>
      {parts.map((part, index) =>
        // Parts are static data constants — index keys are safe here
        part.bold ? (
          <strong key={index}>{part.text}</strong>
        ) : (
          part.text  // plain text node, no wrapper span needed
        ),
      )}
    </Tag>
  );
}
