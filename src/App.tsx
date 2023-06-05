import {
  Center,
  Grid,
  Title,
  Text,
  useMantineTheme,
  Anchor,
  ThemeIcon,
  MantineProvider,
  Switch,
  Flex,
  Alert,
} from "@mantine/core";
import "./App.css";
import { Uploader } from "./Uploader";
import {
  IconAlertCircle,
  IconFileZip,
  IconMoonStars,
  IconSun,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { FilesView } from "./FilesView";
import JSZip from "jszip";

function App() {
  const theme = useMantineTheme();
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");
  const [filename, setFilename] = useState<string>("archive.zip");
  const [compressionLevel, setCompressionLevel] = useState<number>(7);
  const [entries, setEntries] = useState<EntriesType>({});
  const [alert, setAlert] = useState<[string, NodeJS.Timeout] | null>();
  const [downloading, setDownloading] = useState<number|null>(null);

  useEffect(() => {
    if (window.matchMedia) {
      var match = window.matchMedia("(prefers-color-scheme: dark)");
      setColorScheme(match.matches ? "dark" : "light");
    }
  }, []);

  function getCloser() {
    return setTimeout(() => setAlert(null), 5000);
  }

  async function downloadZIP() {
    const objEntries = Object.entries(entries);
    if (objEntries.length === 0) {
      setAlert(["No files to download!", getCloser()]);
      return;
    }
    try {
      setDownloading(performance.now());
      const zip = new JSZip();
      objEntries.forEach(([name, file]) => zip.file(name, file));

      const blob = await zip.generateAsync({
        type: "blob",
        compression: compressionLevel === 0 ? "STORE" : "DEFLATE",
        compressionOptions: { level: compressionLevel },
        platform: "UNIX",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch (e) {
      console.error(e);
      setAlert([String(e), getCloser()]);
    }
    setDownloading(null);
  }

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: colorScheme,
      }}
    >
      <Center>
        <Grid m="md">
          <Grid.Col span={12}>
            <Grid>
              <Grid.Col span={11}>
                <Title
                  order={1}
                  color={colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[9]}
                >
                  <ThemeIcon
                    size="lg"
                    mr="sm"
                    variant="gradient"
                    gradient={{ from: "blue", to: "green", deg: 45 }}
                  >
                    <IconFileZip />
                  </ThemeIcon>
                  ZAG.ZIP
                </Title>
                <Text size="lg">
                  An In-Browser{" "}
                  <span style={{ color: theme.colors.gray[0] }}>Z</span>IP{" "}
                  <span style={{ color: theme.colors.gray[0] }}>A</span>rchive{" "}
                  <span style={{ color: theme.colors.gray[0] }}>G</span>
                  enerator
                </Text>
              </Grid.Col>
              <Grid.Col span={1}>
                <Flex justify={"end"}>
                  <Switch
                    checked={colorScheme === "dark"}
                    onChange={(e) => {
                      setColorScheme(
                        e.currentTarget.checked ? "dark" : "light"
                      );
                    }}
                    offLabel={
                      <IconSun
                        size="1rem"
                        stroke={2.5}
                        color={theme.colors.yellow[4]}
                      />
                    }
                    onLabel={
                      <IconMoonStars
                        size="1rem"
                        stroke={2.5}
                        color={theme.colors.blue[6]}
                      />
                    }
                  />
                </Flex>
              </Grid.Col>
            </Grid>
          </Grid.Col>

          {alert && (
            <Grid.Col span={12}>
              <Center>
                <Alert
                  w="50%"
                  withCloseButton
                  icon={<IconAlertCircle size="1rem" />}
                  title="Whoops!"
                  color="red"
                  onClose={() => setAlert(null)}
                >
                  {alert[0]}
                </Alert>
              </Center>
            </Grid.Col>
          )}

          <Grid.Col span={12}>
            <Grid>
              <Grid.Col lg={6} sm={12}>
                <FilesView
                  entries={entries}
                  filename={filename}
                  compressionLevel={compressionLevel}
                  onFilenameChanged={setFilename}
                  onDownload={downloadZIP}
                  downloading={downloading}
                  onCompressionLevelChanged={setCompressionLevel}
                  onChanged={(entries) => {
                    setEntries(entries);
                  }}
                />
              </Grid.Col>
              <Grid.Col lg={6} sm={12}>
                <Uploader
                  onUpload={(newFiles) => {
                    setEntries((oldEntries) => {
                      const newEntries = newFiles.map((file) => [
                        file.name,
                        file,
                      ]);
                      return {
                        ...oldEntries,
                        ...Object.fromEntries(newEntries),
                      };
                    });
                  }}
                />
              </Grid.Col>
            </Grid>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text color={theme.colors.gray[6]} size="sm" align="center" p={20}>
              A weekend project by{" "}
              <Anchor href="https://luten.dev/">Eddy Luten</Anchor> &copy; 2023
            </Text>
          </Grid.Col>
        </Grid>
      </Center>
    </MantineProvider>
  );
}

export default App;
