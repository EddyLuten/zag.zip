import {
  ActionIcon,
  Button,
  Card,
  Center,
  Flex,
  Slider,
  Space,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import {
  IconCircleX,
  IconFile,
  IconFileText,
  IconGif,
  IconJpg,
  IconPng,
  IconZip,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

function mimeIcon(mime: string) {
  switch (mime) {
    case "application/zip":
      return IconZip;
    case "image/png":
      return IconPng;
    case "image/jpeg":
      return IconJpg;
    case "image/gif":
      return IconGif;
    case "text/plain":
      return IconFileText;
    default:
      return IconFile;
  }
}

export interface FilesViewProps {
  entries: EntriesType;
  filename: string;
  compressionLevel: number;
  downloading: number | null;
  onCompressionLevelChanged: (level: number) => void;
  onDownload: () => void;
  onFilenameChanged: (filename: string) => void;
  onChanged?: (entries: EntriesType) => void;
}

export interface DirectoryProps {
  id: string;
  entries: EntriesType;
  onChanged?: (entry: EntriesType) => void;
}

function readableFileSize(size: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  for (; size > 1024; ++i, size /= 1024.0);
  return `${size.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

function Directory(props: DirectoryProps) {
  const theme = useMantineTheme();
  const mappable = Object.entries(props.entries).sort(([name1], [name2]) =>
    name1.localeCompare(name2)
  );
  const byteTotal = mappable.reduce((acc, [_, entry]) => acc + entry.size, 0);
  return (
    <>
      <Center>
        <Text size="sm" color="dimmed">
          {mappable.length} entries - {readableFileSize(byteTotal)}
        </Text>
      </Center>
      <Stack>
        {mappable.map(([name, entry], i) => {
          const CurrentIcon = mimeIcon(entry.type);
          return (
            <Flex
              bg={
                i % 2 === 0
                  ? theme.colors.gray[theme.colorScheme === "light" ? 2 : 9]
                  : undefined
              }
              mih={50}
              gap="md"
              justify="space-between"
              align="center"
              direction="row"
              wrap="nowrap"
            >
              <ThemeIcon
                color={"orange"}
                variant="outline"
                radius="xl"
                m={"sm"}
              >
                <CurrentIcon />
              </ThemeIcon>
              <Text
                title={name}
                truncate
                sx={{
                  flexGrow: 3,
                }}
              >
                {name}
              </Text>
              <Text display={"block"} align="center" miw="80px">
                ({readableFileSize(entry.size)})
              </Text>
              <ActionIcon
                color="red"
                radius="xl"
                variant="subtle"
                onClick={() => {
                  const newEntries = { ...props.entries };
                  delete newEntries[name];
                  props.onChanged?.(newEntries);
                }}
              >
                <IconCircleX />
              </ActionIcon>
            </Flex>
          );
        })}
        {mappable.length === 0 && (
          <Text>
            <em>No files selected.</em>
          </Text>
        )}
      </Stack>
    </>
  );
}

export function FilesView(props: FilesViewProps) {
  const [latest, setLatest] = useState(0);
  useEffect(() => {
    if (props.downloading !== null) {
      setTimeout(() => setLatest(performance.now()), 100);
    } else {
      setLatest(0);
    }
  }, [props.downloading, setLatest, latest]);
  return (
    <Flex direction="column">
      <Card shadow="sm" padding="sm" mb="lg" withBorder>
        <TextInput
          label="Filename"
          value={props.filename}
          onChange={(e) => props.onFilenameChanged(e.target.value)}
        />
        <Space h="sm" />
        <Text size="sm" color="dimmed">
          Compression level 0 is no compression (very fast) and 9 is maximum
          compression (very slow).
        </Text>
        <Slider
          showLabelOnHover
          min={0}
          max={9}
          step={1}
          label={props.compressionLevel}
          value={props.compressionLevel}
          onChange={props.onCompressionLevelChanged}
        />
        <Space h="sm" />
        <Button
          fullWidth
          disabled={props.downloading !== null}
          variant="light"
          onClick={props.onDownload}
        >
          {!props.downloading
            ? "Compress and Download"
            : `Compressing: ${(latest - props.downloading).toFixed(2)}ms...`}
        </Button>
      </Card>
      <Card shadow="sm" padding="sm" withBorder>
        <Directory
          id="root"
          entries={props.entries}
          onChanged={props.onChanged}
        />
      </Card>
    </Flex>
  );
}
