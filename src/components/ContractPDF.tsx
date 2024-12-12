import { Document, Page, Text, View, StyleSheet, DocumentProps } from '@react-pdf/renderer';
import type { Contract } from '@/types/contract';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    marginBottom: 5,
  },
  signatures: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signature: {
    width: '40%',
    borderTopWidth: 1,
    borderColor: '#000',
    paddingTop: 5,
    textAlign: 'center',
  },
});

interface ContractPDFProps extends DocumentProps {
  contract: Contract;
}

const ContractContent = ({ contract }: { contract: Contract }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.header}>
      <Text style={styles.title}>UMOWA O DZIEŁO</Text>
    </View>

    <View style={styles.section}>
      <Text>
        Zawarta w dniu {contract.contractDate} w {
          contract.companyType === 'PC_Beskidy' ? 'Bukowno' : 'Paris'
        } pomiędzy:
      </Text>
    </View>

    <View style={styles.section}>
      <Text>
        {contract.companyType === 'PC_Beskidy' ? 'PC Beskidy Sp. z o.o.' : 'Paris Cosmetics'}{'\n'}
        {contract.companyAddress}{'\n'}
        NIP: {contract.companyNIP}
      </Text>
      <Text style={styles.text}>zwanym dalej "Zamawiającym"</Text>
    </View>

    <View style={styles.section}>
      <Text>a</Text>
    </View>

    {contract.contractorData && (
      <View style={styles.section}>
        <Text>
          {contract.contractorData.fullName}{'\n'}
          {contract.contractorData.address}{'\n'}
          Nr konta: {contract.contractorData.bankAccount}
        </Text>
        <Text style={styles.text}>zwanym dalej "Wykonawcą"</Text>
      </View>
    )}

    <View style={styles.section}>
      <Text style={styles.label}>§ 1</Text>
      <Text>
        Wykonawca zobowiązuje się do wykonania następujących prac:{'\n'}
        {contract.workScope.tiktok && '- TikTok + boost\n'}
        {contract.workScope.promotionalMaterial && '- Materiał promocyjny'}
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.label}>§ 2</Text>
      <Text>
        1. Wykonawca rozpocznie pracę w dniu {contract.startDate}.{'\n'}
        2. Praca zostanie wykonana do dnia {contract.endDate}.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.label}>§ 3</Text>
      <Text>
        Za wykonanie dzieła Wykonawca otrzyma wynagrodzenie w wysokości {contract.remuneration} EUR netto.
      </Text>
    </View>

    <View style={styles.signatures}>
      <View style={styles.signature}>
        <Text>Zamawiający</Text>
      </View>
      <View style={styles.signature}>
        <Text>Wykonawca</Text>
      </View>
    </View>
  </Page>
);

const ContractPDF = ({ contract, ...props }: ContractPDFProps) => (
  <Document {...props}>
    <ContractContent contract={contract} />
  </Document>
);

export default ContractPDF;
