// Framer Code Override – Password-Protect Specific Pages
// Paste this into a Code Override file in your Framer project.

import type { ComponentType } from "react"
import { useState, useEffect, createContext, useContext } from "react"

// ─── CONFIGURATION ───────────────────────────────────────────────
// Add the URL paths you want to protect (e.g. "/secret", "/members").
// All other pages remain public.
const PROTECTED_PATHS: string[] = ["/secret", "/members", "/dashboard"]

// The password visitors must enter to access protected pages.
const PASSWORD = "changeme123"

// How long access lasts (in milliseconds). Default: 24 hours.
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000

// localStorage key
const STORAGE_KEY = "framer_pw_auth"
// ─────────────────────────────────────────────────────────────────

function isProtectedPath(): boolean {
    const path = window.location.pathname.replace(/\/+$/, "") || "/"
    return PROTECTED_PATHS.some(
        (p) => path === p || path.startsWith(p + "/")
    )
}

function isAuthenticated(): boolean {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return false
        const { exp } = JSON.parse(raw)
        if (Date.now() > exp) {
            localStorage.removeItem(STORAGE_KEY)
            return false
        }
        return true
    } catch {
        return false
    }
}

function authenticate() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ exp: Date.now() + SESSION_DURATION_MS })
    )
}

// ─── PASSWORD GATE COMPONENT ────────────────────────────────────

function PasswordGate({ children }: { children: React.ReactNode }) {
    const [authed, setAuthed] = useState(false)
    const [input, setInput] = useState("")
    const [error, setError] = useState(false)

    useEffect(() => {
        if (isAuthenticated()) setAuthed(true)
    }, [])

    if (!isProtectedPath() || authed) {
        return <>{children}</>
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input === PASSWORD) {
            authenticate()
            setAuthed(true)
            setError(false)
        } else {
            setError(true)
        }
    }

    return (
        <div style={styles.overlay}>
            <form onSubmit={handleSubmit} style={styles.card}>
                <h2 style={styles.title}>This page is protected</h2>
                <p style={styles.subtitle}>Enter the password to continue.</p>
                <input
                    type="password"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value)
                        setError(false)
                    }}
                    placeholder="Password"
                    style={{
                        ...styles.input,
                        borderColor: error ? "#e53e3e" : "#e2e8f0",
                    }}
                    autoFocus
                />
                {error && (
                    <p style={styles.error}>Incorrect password. Try again.</p>
                )}
                <button type="submit" style={styles.button}>
                    Unlock
                </button>
            </form>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    overlay: {
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
    },
    card: {
        background: "#fff",
        borderRadius: 12,
        padding: "40px 32px",
        maxWidth: 380,
        width: "90%",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    },
    title: {
        margin: 0,
        fontSize: 22,
        fontWeight: 600,
        color: "#1a202c",
        textAlign: "center",
    },
    subtitle: {
        margin: 0,
        fontSize: 14,
        color: "#718096",
        textAlign: "center",
    },
    input: {
        padding: "10px 14px",
        fontSize: 15,
        borderRadius: 8,
        border: "1.5px solid #e2e8f0",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
    },
    error: {
        margin: 0,
        fontSize: 13,
        color: "#e53e3e",
        textAlign: "center",
    },
    button: {
        padding: "10px 0",
        fontSize: 15,
        fontWeight: 600,
        color: "#fff",
        background: "#000",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
    },
}

// ─── FRAMER CODE OVERRIDE ───────────────────────────────────────
// Apply this override to your top-level page wrapper / frame.

export function withPasswordProtection(
    Component: ComponentType<any>
): ComponentType<any> {
    return (props: any) => (
        <PasswordGate>
            <Component {...props} />
        </PasswordGate>
    )
}
