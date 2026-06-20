# 🔒 Guia de Segurança da Web - Básico

Este documento fornece diretrizes essenciais para reduzir riscos de segurança em aplicações web e manter a proteção de dados e usuários.

---

## 📋 Objetivo

Estabelecer práticas recomendadas de segurança para desenvolvimento, implantação e manutenção de aplicações web seguras.

---

## 🔄 Atualizações e Dependências

- **Mantenha dependências atualizadas** regularmente.
- Use ferramentas de scanning automático:
  - [Dependabot](https://docs.github.com/en/code-security/dependabot) (GitHub)
  - [Snyk](https://snyk.io/)
  - [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- Bloqueie versões e verifique **changelogs de segurança** antes de atualizar.
- Configure alertas para vulnerabilidades em dependências.

---

## 🔐 Autenticação e Autorização

- **Use autenticação forte:**
  - Senhas com mínimo 12 caracteres (maiúsculas, minúsculas, números, símbolos)
  - Autenticação Multi-Fator (MFA/2FA)
  - Tokens com expiração configurada
  
- **Armazenamento seguro de senhas:**
  - Nunca armazene em texto claro
  - Use hashing: `bcrypt`, `Argon2`, ou `scrypt`
  - Nunca use MD5 ou SHA1 para senhas
  
- **Princípio do Menor Privilégio:**
  - Contas e serviços com permissões mínimas necessárias
  - Revise e rote acessos administrativos regularmente

---

## 🌐 Comunicação Segura

- **HTTPS/TLS obrigatório:**
  - Certificados válidos (use [Let's Encrypt](https://letsencrypt.org/) gratuitamente)
  - Redirecione todas as requisições HTTP → HTTPS
  - Configure **HSTS** (HTTP Strict Transport Security)
  
- **Exemplo de cabeçalho HSTS:**
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  ```

---

## ✅ Validação e Sanitização de Entrada

- **Valide e sanitize TODA entrada do usuário no servidor** (não confie apenas em validação cliente)
  
- **Proteção contra SQL Injection:**
  - Use queries parametrizadas ou ORM
  - Exemplo seguro:
    ```sql
    SELECT * FROM users WHERE id = ? -- Use placeholders
    ```
  - Evite concatenação de strings em queries
  
- **Proteção contra XSS (Cross-Site Scripting):**
  - Escape HTML/JavaScript em saídas
  - Implemente **Content Security Policy (CSP):**
    ```
    Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
    ```

---

## 🍪 Gerenciamento de Sessão

- **Cookies seguros:**
  - `Secure`: Apenas transmitidos por HTTPS
  - `HttpOnly`: Inacessível por JavaScript (protege contra XSS)
  - `SameSite=Strict` ou `SameSite=Lax` (protege contra CSRF)
  
- **Exemplos:**
  ```
  Set-Cookie: sessionId=abc123; Secure; HttpOnly; SameSite=Strict; Max-Age=3600
  ```

- **Expiração:**
  - Tempo de sessão razoável (30min a 2h para admin, 24h para usuário)
  - Logout explícito e invalidação de token no servidor

---

## 🛡️ Cabeçalhos de Segurança HTTP

Configure os seguintes cabeçalhos em todas as respostas:

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## 🔗 Controle de CORS (Cross-Origin Resource Sharing)

- Configure CORS **estritamente**:
  ```
  Access-Control-Allow-Origin: https://seu-dominio.com (específico, não *)
  Access-Control-Allow-Methods: GET, POST
  Access-Control-Allow-Credentials: true
  ```

- Evite `Access-Control-Allow-Origin: *` em APIs autenticadas

---

## 🔑 Armazenamento de Segredos

- **Nunca comite segredos no Git:**
  - Senhas, chaves de API, tokens, credenciais de BD
  
- **Use:**
  - Variáveis de ambiente seguras
  - Vaults (HashiCorp Vault, AWS Secrets Manager)
  - Gerenciadores de segredos (1Password, Bitwarden)
  
- **Revogue imediatamente:**
  - Chaves comprometidas
  - Credenciais expostas acidentalmente
  
- **Arquivo `.gitignore`:**
  ```
  .env
  .env.local
  secrets/
  *.key
  *.pem
  ```

---

## 📊 Logs e Monitoramento

- **Monitore ativamente:**
  - Falhas de autenticação repetidas
  - Acessos anormais
  - Alterações em dados sensíveis
  
- **Configure alertas** para comportamentos suspeitos
  
- **Logs sem dados sensíveis:**
  - Não registre senhas, tokens, números de cartão
  - Use mascaramento para PII (Personally Identifiable Information)
  
- **Retenção de logs:**
  - Mínimo 90 dias para auditoria
  - Arquive logs antigos com segurança

---

## 💾 Backup e Recuperação

- **Backups regulares:**
  - Diário para dados críticos
  - Semanal para dados gerais
  
- **Teste restauração** periodicamente (mínimo mensalmente)
  
- **Armazene backups:**
  - Fora do servidor principal (offsite)
  - Criptografados
  - Com acesso restrito

---

## 🧪 Testes e Revisão

- **Revisão de código** antes de merge (Pull Request)
  
- **Análise estática de segurança:**
  - [SonarQube](https://www.sonarqube.org/)
  - [Checkmarx](https://checkmarx.com/)
  
- **Pentests periódicos:**
  - Mínimo anualmente
  - Ou após mudanças críticas
  
- **OWASP Top 10:**
  - Familiarize-se com as [10 vulnerabilidades mais comuns](https://owasp.org/www-project-top-ten/)

---

## ✔️ Checklist de Implantação

Antes de colocar em produção, verifique:

- [ ] HTTPS/TLS configurado com certificado válido
- [ ] Variáveis de ambiente setadas (sem segredos em código)
- [ ] Scans de dependência passaram (sem vulnerabilidades críticas)
- [ ] Cabeçalhos de segurança HTTP configurados
- [ ] CORS restrito para origens permitidas
- [ ] Backup automático ativado e testado
- [ ] Logging e monitoramento em funcionamento
- [ ] MFA ativado para contas administrativas
- [ ] Senhas fortes para todos os usuários
- [ ] Testes de segurança básicos executados
- [ ] Documentação de segurança atualizada
- [ ] Plano de incidente de segurança definido

---

## 📚 Recursos Úteis

- **OWASP:**
  - [Top 10 Web Application Security Risks](https://owasp.org/www-project-top-ten/)
  - [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
  
- **Scanning de Dependências:**
  - [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot)
  - [Snyk](https://snyk.io/)
  
- **Certificados SSL/TLS:**
  - [Let's Encrypt](https://letsencrypt.org/)
  - [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
  
- **Testes de Segurança:**
  - [OWASP ZAP](https://www.zaproxy.org/)
  - [Burp Suite Community](https://portswigger.net/burp/communitydownload)
  
- **Educação:**
  - [PortSwigger Web Security Academy](https://portswigger.net/web-security)
  - [HackTheBox](https://www.hackthebox.com/)

---

## 📞 Reportar Vulnerabilidades

Se encontrou uma vulnerabilidade de segurança:

1. **Não publique** em issues públicas
2. **Entre em contato** com o responsável do projeto via email privado
3. Descreva a vulnerabilidade detalhadamente
4. Aguarde resposta antes de divulgar publicamente

---

**Última atualização:** 2026-06-20

*Mantenha este documento atualizado e revise regularmente as práticas de segurança do projeto.*
