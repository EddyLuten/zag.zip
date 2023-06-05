import { useMantineTheme, Text, Group, ThemeIcon } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconInfoCircle, IconUpload } from "@tabler/icons-react";

export interface UploaderProps {
  onUpload: (file: File[]) => void;
}

export function Uploader(props: UploaderProps) {
  const theme = useMantineTheme();
  return (
    <Dropzone
      onDrop={(files) => props.onUpload(files)}
      mih="100%"
      styles={{
        root: {
          display: "flex",
          alignItems: "center",
          boxShadow: '0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.05),rgba(0, 0, 0, 0.05) 0 0.625rem 0.9375rem -0.3125rem,rgba(0, 0, 0, 0.04) 0 0.4375rem 0.4375rem -0.3125rem'
        },
      }}
    >
      <Group position="center" spacing="xl">
        <IconUpload size="3.2rem" stroke={1.5} color={theme.colors.blue[5]} />
        <Text size="xl">
          Drag files here or click to select files
        </Text>
        <Text size="md" color="dimmed">
          Select as many files as you like, they will be combined into a single
          zip archive inside of your browser before being downloaded.
        </Text>
        <Text size="md" color={theme.colors.green[7]}>
          This is a client-side only application, your files are never sent to
          any server.
        </Text>
      </Group>
    </Dropzone>
  );
}
