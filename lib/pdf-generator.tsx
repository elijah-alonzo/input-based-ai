import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Image,
} from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontSize: 12,
    lineHeight: 1.6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333333",
  },
  image: {
    width: "100%",
    maxHeight: 200,
    objectFit: "cover",
    marginBottom: 20,
    borderRadius: 4,
  },
  content: {
    fontSize: 12,
    lineHeight: 1.8,
    textAlign: "justify",
    color: "#444444",
  },
  paragraph: {
    marginBottom: 15,
  },
});

type ArticlePDFProps = {
  title: string;
  content: string;
  imageData?: string; // base64 encoded image
};

// PDF Document Component
const ArticlePDF = ({ title, content, imageData }: ArticlePDFProps) => {
  // Split content into paragraphs for better formatting
  const paragraphs = content.split("\n").filter((p) => p.trim() !== "");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        {imageData && <Image src={imageData} style={styles.image} />}
        <View style={styles.content}>
          {paragraphs.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph.trim()}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
};

// Function to generate and download PDF
export const downloadArticlePDF = async (
  title: string,
  content: string,
  imageData?: string,
) => {
  try {
    // Clean title for filename (remove special characters)
    const cleanTitle = title
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    const filename = `article-${cleanTitle || "untitled"}.pdf`;

    // Generate PDF blob
    const blob = await pdf(
      <ArticlePDF title={title} content={content} imageData={imageData} />,
    ).toBlob();

    // Create download link and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
