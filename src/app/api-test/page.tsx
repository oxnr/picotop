import { APITest } from '@/components/api-test'

export default function APITestPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Bitcoin API Test Page</h1>
        <APITest />
      </div>
    </div>
  )
}