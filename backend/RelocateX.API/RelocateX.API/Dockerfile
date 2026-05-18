FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Sabhi .csproj files copy karo (order important hai)
COPY ["RelocateX.API.csproj", "RelocateX.API/"]
COPY ["../RelocateX.Infrastructure/RelocateX.Infrastructure.csproj", "RelocateX.Infrastructure/"]
COPY ["../RelocateX.Application/RelocateX.Application.csproj", "RelocateX.Application/"]
COPY ["../RelocateX.Domain/RelocateX.Domain.csproj", "RelocateX.Domain/"]

# Restore
RUN dotnet restore "RelocateX.API/RelocateX.API.csproj"

# Pura source copy karo
COPY . RelocateX.API/
COPY ../RelocateX.Infrastructure RelocateX.Infrastructure/
COPY ../RelocateX.Application RelocateX.Application/
COPY ../RelocateX.Domain RelocateX.Domain/

# Publish
WORKDIR /src/RelocateX.API
RUN dotnet publish "RelocateX.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "RelocateX.API.dll"]