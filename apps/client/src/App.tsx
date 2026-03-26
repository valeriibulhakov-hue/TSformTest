import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './_components/layout/layout'
import { HomePage } from './_pages/Home'
import { FormBuilderPage } from './_pages/FormBuilder/FormBuilder'
import { FormFillerPage } from './_pages/FormFiller/FormFiller'
import { FormResponsesPage } from './_pages/FormResponses/FormResponses'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forms/new" element={<FormBuilderPage />} />
          <Route path="/forms/:id/fill" element={<FormFillerPage />} />
          <Route path="/forms/:id/responses" element={<FormResponsesPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App