import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { format, parseISO } from 'date-fns';
import { HealthRecord, Medication } from '../lib/store';

interface ExportData {
  healthRecords: HealthRecord[];
  medications: Medication[];
  childName: string;
  exportDate: string;
}

export async function exportHealthData(data: ExportData): Promise<void> {
  const { healthRecords, medications, childName, exportDate } = data;

  // Create a formatted text report
  const report = [
    `Health Report for ${childName}`,
    `Generated on ${format(parseISO(exportDate), 'MMMM d, yyyy')}`,
    '\n',
    'HEALTH RECORDS',
    '=============',
    ...healthRecords.map((record) => [
      `Date: ${format(parseISO(record.createdAt), 'MMMM d, yyyy')}`,
      `Type: ${record.type}`,
      `Title: ${record.title}`,
      record.notes ? `Notes: ${record.notes}` : '',
      record.data?.height ? `Height: ${record.data.height} cm` : '',
      record.data?.weight ? `Weight: ${record.data.weight} kg` : '',
      '\n',
    ].filter(Boolean).join('\n')),
    '\n',
    'MEDICATIONS',
    '===========',
    ...medications.map((med) => [
      `Name: ${med.name}`,
      `Dosage: ${med.dosage}`,
      `Frequency: ${med.frequency}`,
      `Start Date: ${format(parseISO(med.startDate), 'MMMM d, yyyy')}`,
      med.endDate ? `End Date: ${format(parseISO(med.endDate), 'MMMM d, yyyy')}` : 'End Date: Ongoing',
      `Status: ${med.active ? 'Active' : 'Completed'}`,
      med.notes ? `Notes: ${med.notes}` : '',
      '\n',
    ].filter(Boolean).join('\n')),
  ].join('\n');

  // Create CSV files for data analysis
  const healthRecordsCsv = [
    'Date,Type,Title,Notes,Height,Weight',
    ...healthRecords.map((record) => [
      format(parseISO(record.createdAt), 'yyyy-MM-dd'),
      record.type,
      record.title.replace(/,/g, ';'),
      (record.notes || '').replace(/,/g, ';'),
      record.data?.height || '',
      record.data?.weight || '',
    ].join(',')),
  ].join('\n');

  const medicationsCsv = [
    'Name,Dosage,Frequency,Start Date,End Date,Status,Notes',
    ...medications.map((med) => [
      med.name.replace(/,/g, ';'),
      med.dosage.replace(/,/g, ';'),
      med.frequency.replace(/,/g, ';'),
      format(new Date(med.startDate), 'yyyy-MM-dd'),
      med.endDate ? format(new Date(med.endDate), 'yyyy-MM-dd') : '',
      med.active ? 'Active' : 'Completed',
      (med.notes || '').replace(/,/g, ';'),
    ].join(',')),
  ].join('\n');

  // Create a ZIP file containing both formats
  const tempDir = `${FileSystem.cacheDirectory}health_export/`;
  const zipFile = `${FileSystem.cacheDirectory}${childName.replace(/\s+/g, '_')}_health_data.zip`;

  try {
    // Create temp directory
    await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });

    // Write files
    await FileSystem.writeAsStringAsync(
      `${tempDir}health_report.txt`,
      report
    );
    await FileSystem.writeAsStringAsync(
      `${tempDir}health_records.csv`,
      healthRecordsCsv
    );
    await FileSystem.writeAsStringAsync(
      `${tempDir}medications.csv`,
      medicationsCsv
    );

    // Create ZIP
    // Note: FileSystem.zipAsync is not available in the current version
    // For now, we'll just share the individual files
    const files = await FileSystem.readDirectoryAsync(tempDir);
    for (const file of files) {
      const filePath = `${tempDir}${file}`;
      await Sharing.shareAsync(filePath);
    }

    // Share the ZIP file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(zipFile, {
        mimeType: 'application/zip',
        dialogTitle: `Health Data for ${childName}`,
        UTI: 'public.zip-archive',
      });
    }

    // Clean up
    await FileSystem.deleteAsync(tempDir, { idempotent: true });
    await FileSystem.deleteAsync(zipFile, { idempotent: true });
  } catch (error) {
    console.error('Failed to export health data:', error);
    throw new Error('Failed to export health data');
  }
}
