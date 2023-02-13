import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
    PDFDownloadLink,
    pdf,
} from "@react-pdf/renderer";
import { useState } from "react";
import Button from "@/components/Button";
import api from '@/lib/common/api'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

const PDF = ({ quote, deal, settings }) => (
    <Document>
        {/*render a single page*/}
        <Page size="A4" style={styles.page}>
            <View style={styles.companyName}>
                <Text style={styles.text}>{settings?.companyName}</Text>
            </View>
            <View style={styles.addressBlockLeft}>
                <Text style={styles.text}>{deal?.contact?.id === quote?.clientName ? deal?.contact?.firstName + ' ' + deal?.contact?.lastName : deal?.compamy?.companyName}</Text>
                <Text style={styles.text}>{quote?.street}</Text>
                <Text style={styles.text}>{quote?.zip} {quote?.city}</Text>
                <Text style={styles.text}>{quote?.country}</Text>
            </View>
            <View style={styles.addressBlockRight}>
                <Text style={styles.text}># {quote?.quoteNumber}</Text>
                <Text style={styles.text}>{quote?.clientId}</Text>
                <Text style={styles.text}>{quote?.quoteDate}</Text>
                <Text style={styles.text}>Valid until: {quote?.validUntil} days</Text>
            </View>
            <View style={styles.subject}>
                <Text style={styles.subjectText}>{quote?.subject}</Text>
            </View>
            <View style={styles.intro}>
                <Text style={styles.subjectText}>{quote?.intro}</Text>
            </View>
            <View style={styles.itemsHeader}>
                <Text style={styles.textProduct}>Product</Text>
                <Text style={styles.textItemsAmount}>#</Text>
                <Text style={styles.textItems}>Price</Text>
                <Text style={styles.textItems}>VAT</Text>
                <Text style={styles.textItems}>Disc.</Text>
                <Text style={styles.textItemsTotal}>Total</Text>
            </View>
            {quote && quote?.item?.map((item, index) => {
                return (
                    <View key={index} style={styles.items}>
                        <Text style={styles.textProduct}>{item.name}</Text>
                        <Text style={styles.textItemsAmount}>{item.amount}</Text>
                        <Text style={styles.textItems}>{parseFloat(item.price).toLocaleString(settings.language, { style: "currency", currency: settings.currency })}</Text>
                        <Text style={styles.textItems}>{item.vat}%</Text>
                        <Text style={styles.textItems}>{parseFloat(item.discount ? item.discount : 0).toLocaleString(settings.language, { style: "currency", currency: settings.currency })}</Text>
                        <Text style={styles.textItemsTotal}>{parseFloat((item.amount * item.price) + (item.amount * item.price * item.vat / 100)).toLocaleString(settings.language, { style: "currency", currency: settings.currency })}</Text>
                    </View>
                )
            }
            )}
            <View style={styles.totalSummaryFirst}>
                <Text style={styles.textProduct}></Text>
                <Text style={styles.textItemsAmount}></Text>
                <Text style={styles.textItems}></Text>
                <Text style={styles.textItems}></Text>
                <Text style={styles.textItems}>Discount</Text>
                <Text style={styles.textItemsTotal}>{quote?.item?.reduce((a, b) => a + parseFloat(b.discount ? b.discount : 0), 0).toLocaleString(settings.language, { style: "currency", currency: settings.currency })}</Text>
            </View>
            <View style={styles.totalSummary}>
                <Text style={styles.textProduct}></Text>
                <Text style={styles.textItemsAmount}></Text>
                <Text style={styles.textItems}></Text>
                <Text style={styles.textItems}></Text>
                <Text style={styles.textItems}>VAT</Text>
                <Text style={styles.textItemsTotal}>{quote?.item?.reduce((a, b) => a + (parseFloat(b.amount) * parseFloat(b.price) * parseFloat(b.vat) / 100), 0).toLocaleString(settings.language, { style: "currency", currency: settings.currency })}</Text>
            </View>
            <View style={styles.totalSummary}>
                <Text style={styles.textProduct}></Text>
                <Text style={styles.textItemsAmount}></Text>
                <Text style={styles.textItems}></Text>
                <Text style={styles.textItems}></Text>
                <Text style={styles.textItems}>Total.</Text>
                <Text style={styles.textItemsTotal}>{quote?.item?.reduce((a, b) => a + ((parseFloat(b.amount) * parseFloat(b.price)) + (parseFloat(b.amount) * parseFloat(b.price) * parseFloat(b.vat) / 100)), 0).toLocaleString(settings.language, { style: "currency", currency: settings.currency })}</Text>
            </View>

            <View style={styles.subject}>
                <Text style={styles.subjectText}>{quote?.footer}</Text>
            </View>
            <View style={styles.subject}>
                <Text style={styles.subjectText}>{quote?.note}</Text>
            </View>
            <View style={styles.subject}>
                <Text style={styles.subjectText}>**signature_1**</Text>
            </View>
        </Page>
    </Document >
);


// Create Document Component
function BasicDocument({ quote, deal, settings }) {

    const router = useRouter();
    const { workspaceSlug, id } = router.query;
    const [signLoader, setSignLoader] = useState(false);

    const formInput = {
        clientName: quote?.clientName || '',
        invoiceNumber: quote?.quoteNumber || '',
        dealId: id,
        street: quote?.street || '',
        clientId: quote?.clientId || '',
        invoiceStatus: 'draft',
        zip: quote?.zip || '',
        city: quote?.city || '',
        invoiceDate: quote?.quoteDate || '',
        country: quote?.country,
        validUntil: quote?.validUntil || '',
        subject: quote?.subject || '',
        intro: quote?.intro || '',
        item: quote?.item || [],
        footer: quote?.footer || '',
        note: quote?.note || '',
        moduleid: quote?.moduleid || '',
    }

    const convertToInvoice = async () => {
        const method = 'POST';
        const url = "/api/modules/customer-cloud/invoice";
        const body = { formInput };

        const res = await api(url, { method, body });

        toast.success("Invoice converted successfully");
        deleteQuote();
        router.push(`/account/${workspaceSlug}/modules/customer-cloud/deals/card/${deal.id}?tab=quotes`);
    };

    const deleteQuote = async () => {
        const method = 'DELETE';
        const url = `/api/modules/customer-cloud/quote?id=${quote.id}`;
        const res = await api(url, { method });
    };

    const downloadPDF = async () => {
        setSignLoader(true);
        if (!settings?.email) return toast.error("Please add your email in settings");
        if (!settings?.companyName) return toast.error("Please add your name in settings");

        const contact = deal?.contact;
        const company = deal?.company;
        const sEmail = quote.clientName === contact?.id ? contact.contactEmail : company?.email;
        const sName = quote.clientName === contact?.id ? `${contact.firstName} ${contact.lastName}` : company?.companyName;
        const pdfBlob = await pdf(<PDF quote={quote} deal={deal} settings={settings} />).toBlob();
        const base64 = (await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(pdfBlob);
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
        }));

        const method = 'POST';
        const url = "/api/integrations/docusign";
        const body = {
            base64,
            signerEmail: sEmail,
            signerName: sName,
            ccEmail: settings.email,
            ccName: settings.companyName,
        };
        const headers = { 'Content-Type': 'application/json' };
        const res = await api(url, { method, body, headers });
        toast.success("Send to sign successfully");
        setSignLoader(false);
    };


    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <h1 className="text-lg font-bold">Preview</h1>
                <div className="pr-10 mt-10 flex justify-between border-t pt-10">
                    <p className="">Store Quote to your Desktop</p>
                    <Button className="bg-red-600 text-white">
                        <PDFDownloadLink document={<PDF quote={quote} deal={deal} settings={settings} />} fileName={`Quote_${quote?.clientName}_${quote?.quoteDate}.pdf`}>
                            {({ blob, url, loading, error }) =>
                                loading ? 'Loading document...' : 'Download now'
                            }
                        </PDFDownloadLink>
                    </Button>
                </div>
                <div className="pr-10 mt-10 flex justify-between border-t pt-10">
                    <p className="">Change the state of the Quote</p>
                    <Button className="bg-red-600 text-white" onClick={() => convertToInvoice()}>
                        Convert to Invoice
                    </Button>
                </div>
                <div className="pr-10 mt-10 flex justify-between border-t pt-10">
                    <p className="">Send the Quote to Sign</p>
                    {!signLoader ?
                        <Button className="bg-red-600 text-white" onClick={() => downloadPDF()}>
                            Send to Sign
                        </Button>
                        :
                        <div className="animate-pulse">
                            Sending...
                        </div>
                    }
                </div>
            </div>
            <PDFViewer style={styles.viewer} showToolbar={false} >

                {/* Start of the document*/}
                <PDF quote={quote} deal={deal} settings={settings} />
            </PDFViewer>
        </div>
    );
}
export default BasicDocument;




// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: "#ffffff",
        color: "black",
        position: "absolute"
    },
    section: {
        margin: 10,
        padding: 10,
    },
    text: {
        fontSize: "12px"
    },
    companyName: {
        fontSize: "12px",
        fontWeight: "bold",
        paddingLeft: "40px",
        paddingTop: "30px"
    },
    addressBlockLeft: {
        top: "40px",
        position: "relative",
        width: "50%",
        paddingLeft: "40px",
        paddingTop: "30px"
    },
    addressBlockRight: {
        position: "relative",
        paddingRight: "40px",
        right: "0px",
        textAlign: "right"
    },
    address: {
        margin: 2,
        padding: 2,
    },
    subject: {
        position: "relative",
        paddingLeft: "40px",
        paddingTop: "30px"
    },
    subjectText: {
        font: "bold",
        fontSize: "12px",
    },
    intro: {
        position: "relative",
        paddingLeft: "40px",
        paddingTop: "30px"
    },
    items: {
        position: "relative",
        paddingLeft: "40px",
        paddingTop: "10px",
        flexDirection: "row",
        width: "100%",
        gap: "20px",
    },
    itemsHeader: {
        position: "relative",
        paddingLeft: "40px",
        paddingTop: "30px",
        paddingBottom: "10px",
        flexDirection: "row",
        width: "100%",
        gap: "20px",
    },
    textProduct: {
        fontSize: "12px",
        width: "25%",
    },
    textItems: {
        fontSize: "12px",
        width: "55px",
        textAlign: "right",
    },
    textItemsTotal: {
        fontSize: "12px",
        width: "75px",
        textAlign: "right",
    },
    textItemsAmount: {
        fontSize: "12px",
        width: "20px",
    },
    priceSummary: {
        position: "relative",
        top: "40px",
        paddingRight: "40px",
        right: "0px",
        textAlign: "right"
    },
    totalSummaryFirst: {
        position: "relative",
        paddingLeft: "40px",
        paddingTop: "30px",
        flexDirection: "row",
        width: "100%",
        gap: "20px",
        font: "bold",
    },

    totalSummary: {
        position: "relative",
        paddingLeft: "40px",
        paddingTop: "10px",
        flexDirection: "row",
        width: "100%",
        gap: "20px",
    },
    viewer: {
        backgroundColor: "#ffffff",
        width: "100%", //the pdf viewer will take up all of the width and height
        height: "1030px",
    },
});