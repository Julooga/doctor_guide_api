import app from "@/index"
import { mkdir, writeFile } from "node:fs/promises"
import path, { join } from "node:path"
import { Command } from 'commander'

const generateSwagger = async (outPath: string) => {
    // 단위 테스트를 한다면 pathname은 중요하지 않다.
    const req = new Request('http://localhost:8000/docs')
    // 결과를 출력한다
    const response = await app.request(req)

    if (!response.ok) {
      throw new Error(`Failed to generate OpenAPI spec: ${response.status}`)
    }
    
    const spec = await response.json()

    await mkdir(outPath, { recursive: true })
    const jsonPath = join(outPath, 'openapi.json')
    await writeFile(jsonPath, JSON.stringify(spec, null, 2))
}

if (process.argv[1] === __filename) {
    const program = new Command()
    program
        .option("-o, --out <path>", "파일의 저장 경로", path.join(__dirname, ""))
        .parse(process.argv)
    const options = program.opts()

    generateSwagger(options.out).catch((error: unknown) => {
        if (error instanceof Error) {
            console.error(error.message)
        }
        process.exit(1)
    })
}