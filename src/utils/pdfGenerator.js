import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const generarPDFTramite = (tramite, progreso, usuario) => {
  // Crear documento PDF
  const doc = new jsPDF()
  
  // Configurar colores y estilos
  const primaryColor = [14, 165, 233] // Azul
  const secondaryColor = [100, 116, 139] // Gris
  
  // Título principal
  doc.setFontSize(24)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text('Burocracia MX', 105, 20, { align: 'center' })
  
  // Línea decorativa
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.line(20, 28, 190, 28)
  
  // Información del trámite
  doc.setFontSize(18)
  doc.setTextColor(0, 0, 0)
  doc.text(tramite.nombre, 20, 45)
  
  doc.setFontSize(11)
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.text(`Institución: ${tramite.institucion}`, 20, 58)
  doc.text(`Fecha de consulta: ${new Date().toLocaleDateString('es-MX')}`, 20, 66)
  
  // Datos del usuario
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('Datos del usuario:', 20, 80)
  doc.setFontSize(10)
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.text(`Nombre: ${usuario?.nombre_completo || 'Usuario'}`, 25, 90)
  doc.text(`Estado: ${usuario?.estado || 'No especificado'}`, 25, 98)
  
  // Descripción
  let yPosition = 110
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('Descripción:', 20, yPosition)
  yPosition += 7
  doc.setFontSize(10)
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  
  // Dividir descripción en líneas
  const descripcionLines = doc.splitTextToSize(tramite.descripcion, 170)
  doc.text(descripcionLines, 20, yPosition)
  yPosition += descripcionLines.length * 7 + 5
  
  // Información adicional
  const instrucciones = tramite.json_instrucciones
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('Información del trámite:', 20, yPosition)
  yPosition += 7
  
  doc.setFontSize(10)
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.text(`⏱️ Tiempo estimado: ${instrucciones.tiempo_estimado || 'No especificado'}`, 25, yPosition)
  yPosition += 7
  doc.text(`💰 Costo: ${instrucciones.costo || 'No especificado'}`, 25, yPosition)
  yPosition += 7
  
  if (instrucciones.url_oficial) {
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.textWithLink(`🔗 Trámite en línea: ${instrucciones.url_oficial}`, 25, yPosition, { url: instrucciones.url_oficial })
    yPosition += 7
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  }
  
  yPosition += 5
  
  // Tabla de pasos
  if (instrucciones.pasos && instrucciones.pasos.length > 0) {
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text('Pasos a seguir:', 20, yPosition)
    yPosition += 5
    
    const tableData = instrucciones.pasos.map(paso => [
      paso.id,
      paso.titulo,
      paso.checklist.length
    ])
    
    doc.autoTable({
      startY: yPosition,
      head: [['#', 'Paso', '# Requisitos']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      margin: { left: 20 }
    })
    
    yPosition = doc.lastAutoTable.finalY + 10
  }
  
  // Checklist de requisitos
  if (instrucciones.pasos && instrucciones.pasos.length > 0) {
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text('Lista de requisitos:', 20, yPosition)
    yPosition += 5
    
    let allItems = []
    instrucciones.pasos.forEach(paso => {
      paso.checklist.forEach(item => {
        const completado = progreso?.pasos_completados?.includes(`${paso.id}-${item}`)
        allItems.push([paso.id, completado ? '✓' : '□', item])
      })
    })
    
    doc.autoTable({
      startY: yPosition,
      head: [['Paso', 'Estado', 'Requisito']],
      body: allItems,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      margin: { left: 20 }
    })
    
    yPosition = doc.lastAutoTable.finalY + 10
  }
  
  // Tips
  if (instrucciones.tips && instrucciones.tips.length > 0) {
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text('💡 Tips importantes:', 20, yPosition)
    yPosition += 7
    
    doc.setFontSize(10)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    instrucciones.tips.forEach((tip, index) => {
      const tipText = doc.splitTextToSize(`${index + 1}. ${tip}`, 165)
      doc.text(tipText, 25, yPosition)
      yPosition += tipText.length * 6 + 2
    })
  }
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text(
      'Documento generado por Burocracia MX - Simplificando trámites para los mexicanos',
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
    doc.text(`Página ${i} de ${pageCount}`, 105, doc.internal.pageSize.height - 5, { align: 'center' })
  }
  
  // Guardar PDF
  doc.save(`${tramite.nombre.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
}