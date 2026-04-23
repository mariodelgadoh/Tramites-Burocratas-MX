import jsPDF from 'jspdf'

export const generarPDFTramite = (tramite, progreso, usuario) => {
  const doc = new jsPDF()
  let y = 20
  
  // Título
  doc.setFontSize(24)
  doc.setTextColor(14, 165, 233)
  doc.text('Burocracia MX', 105, y, { align: 'center' })
  y += 10
  
  doc.setDrawColor(14, 165, 233)
  doc.line(20, y, 190, y)
  y += 10
  
  // Nombre del trámite
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text(tramite.nombre || 'Trámite', 20, y)
  y += 10
  
  // Institución
  doc.setFontSize(11)
  doc.setTextColor(100, 116, 139)
  doc.text(`Institución: ${tramite.institucion || 'No especificada'}`, 20, y)
  y += 7
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, 20, y)
  y += 12
  
  // Usuario
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('Datos del usuario:', 20, y)
  y += 7
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text(`Nombre: ${usuario?.nombre_completo || 'Usuario'}`, 25, y)
  y += 6
  doc.text(`Estado: ${usuario?.estado || 'No especificado'}`, 25, y)
  y += 12
  
  // Descripción
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('Descripción:', 20, y)
  y += 6
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  const descLines = doc.splitTextToSize(tramite.descripcion || '', 170)
  doc.text(descLines, 20, y)
  y += descLines.length * 5 + 10
  
  // Info del trámite
  const instrucciones = tramite.json_instrucciones || {}
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('Información:', 20, y)
  y += 6
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text(`Tiempo: ${instrucciones.tiempo_estimado || 'No especificado'}`, 25, y)
  y += 6
  doc.text(`Costo: ${instrucciones.costo || 'No especificado'}`, 25, y)
  y += 10
  
  // Pasos
  if (instrucciones.pasos && instrucciones.pasos.length > 0) {
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text('Pasos a seguir:', 20, y)
    y += 8
    
    for (const paso of instrucciones.pasos) {
      if (y > 260) {
        doc.addPage()
        y = 20
      }
      
      doc.setFontSize(11)
      doc.setTextColor(14, 165, 233)
      doc.text(`${paso.id}. ${paso.titulo}`, 20, y)
      y += 6
      
      doc.setFontSize(10)
      doc.setTextColor(100, 116, 139)
      for (const item of paso.checklist) {
        const completado = progreso?.pasos_completados?.includes(`${paso.id}-${item}`)
        const checkMark = completado ? '[X]' : '[ ]'
        const itemLines = doc.splitTextToSize(`${checkMark} ${item}`, 160)
        doc.text(itemLines, 25, y)
        y += itemLines.length * 5 + 2
        
        if (y > 280) {
          doc.addPage()
          y = 20
        }
      }
      y += 4
    }
  }
  
  // Tips
  if (instrucciones.tips && instrucciones.tips.length > 0) {
    if (y > 260) {
      doc.addPage()
      y = 20
    }
    
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text('Tips importantes:', 20, y)
    y += 8
    
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    for (let i = 0; i < instrucciones.tips.length; i++) {
      const tipLines = doc.splitTextToSize(`${i + 1}. ${instrucciones.tips[i]}`, 165)
      doc.text(tipLines, 25, y)
      y += tipLines.length * 5 + 3
      
      if (y > 280) {
        doc.addPage()
        y = 20
      }
    }
  }
  
  // Footer
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text(
    'Burocracia MX - Simplificando trámites para los mexicanos',
    105,
    doc.internal.pageSize.height - 10,
    { align: 'center' }
  )
  
  // Guardar
  const nombreArchivo = `${(tramite.nombre || 'tramite').replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(nombreArchivo)
}